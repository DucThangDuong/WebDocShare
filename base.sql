IF DB_ID('DocShare') IS NOT NULL
BEGIN
    ALTER DATABASE DocShare SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE DocShare;
END
GO

CREATE DATABASE DocShare;
GO
USE DocShare;
GO

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NULL, 
    GoogleId VARCHAR(255),
    FullName NVARCHAR(100),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    RefreshToken VARCHAR(256),
    RefreshTokenExpiryTime DATETIME,
    Role VARCHAR(50) DEFAULT 'User' CHECK(Role IN ('User','Admin')),

    LoginProvider VARCHAR(20) NULL Check(LoginProvider In('Custom','Admin')),
    CustomAvatar VARCHAR(255) DEFAULT 'default-avatar.jpg',
    GoogleAvatar VARCHAR(255),
    IsActive BIT DEFAULT 1,

    StorageLimit BIGINT NOT NULL DEFAULT 5368709120, 
    UsedStorage BIGINT NOT NULL DEFAULT 0
);
GO

CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255)
);
GO
CREATE TABLE Tags (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    Slug VARCHAR(50) NOT NULL 
);
GO

CREATE TABLE Documents (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    
    FileUrl NVARCHAR(500) NOT NULL,
    SizeInBytes BIGINT NOT NULL, 
    Thumbnail NVARCHAR(500),
    PageCount int ,
    
    UploaderId INT NOT NULL,
    CategoryId INT, 
    Status VARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Public', 'Private', 'Rejected')), 
    
    IsDeleted TINYINT DEFAULT 0,
    DeletedAt DATETIME NULL,          
    
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    ViewCount INT NOT NULL DEFAULT 0,
    LikeCount INT NOT NULL DEFAULT 0,
    DislikeCount INT NOT NULL DEFAULT 0,

    CONSTRAINT FK_Docs_User FOREIGN KEY (UploaderId) REFERENCES Users(Id),
    CONSTRAINT FK_Docs_Category FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE SET NULL
);
GO

CREATE TABLE DocumentTags (
    DocumentId BIGINT NOT NULL,
    TagId INT NOT NULL,
    PRIMARY KEY (DocumentId, TagId), 

    CONSTRAINT FK_DocTags_Doc FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE,
    CONSTRAINT FK_DocTags_Tag FOREIGN KEY (TagId) REFERENCES Tags(Id) ON DELETE CASCADE
);
GO
CREATE TABLE DocumentVotes (
    UserId INT NOT NULL,
    DocumentId BIGINT NOT NULL,
    IsLike BIT NOT NULL, 
    VotedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserId, DocumentId), 

    CONSTRAINT FK_Votes_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Votes_Doc FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
);
GO
CREATE TABLE SavedDocuments (
    UserId INT NOT NULL,
    DocumentId BIGINT NOT NULL,
    SavedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserId, DocumentId),

    CONSTRAINT FK_Saved_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Saved_Doc FOREIGN KEY (DocumentId) REFERENCES Documents(Id) ON DELETE CASCADE
);
GO

--==============================Trigger===============================
--cập nhật storage người dùng khi upload dữ liệu lên
CREATE TRIGGER trg_UpdateUsedStorage_OnInsert
ON Documents
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u
    SET u.UsedStorage = u.UsedStorage + i.SizeInBytes
    FROM Users u INNER JOIN INSERTED i ON u.Id = i.UploaderId;
    
    IF EXISTS (SELECT 1 FROM Users u JOIN INSERTED i ON u.Id = i.UploaderId 
               WHERE u.UsedStorage > u.StorageLimit)
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50001, 'Dung lượng lưu trữ của bạn đã đầy!', 1;
    END
END;
GO
-- cập nhật storage khi người dùng xóa
CREATE TRIGGER trg_UpdateUsedStorage_OnDelete
ON Documents
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u
    SET u.UsedStorage = u.UsedStorage - d.SizeInBytes
    FROM Users u
    INNER JOIN DELETED d ON u.Id = d.UploaderId;
END;
GO
-- cập nhật like/dislike/not
CREATE TRIGGER trg_UpdateVoteCounts
ON DocumentVotes
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @AffectedDocs TABLE (DocId BIGINT);
    INSERT INTO @AffectedDocs (DocId)
    SELECT DocumentId FROM INSERTED
    UNION
    SELECT DocumentId FROM DELETED;
    UPDATE d
    SET 
        d.LikeCount = (SELECT COUNT(*) FROM DocumentVotes v WHERE v.DocumentId = d.Id AND v.IsLike = 1),
        d.DislikeCount = (SELECT COUNT(*) FROM DocumentVotes v WHERE v.DocumentId = d.Id AND v.IsLike = 0)
    FROM Documents d
    INNER JOIN @AffectedDocs ad ON d.Id = ad.DocId;
END;
GO
CREATE INDEX IX_Tags_Slug ON Tags(Slug);
CREATE INDEX IX_Documents_IsDeleted ON Documents(IsDeleted); 
CREATE INDEX IX_Documents_UploaderId ON Documents(UploaderId);