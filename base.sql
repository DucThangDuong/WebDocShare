CREATE DATABASE DocShareSimpleDb;
GO
USE DocShareSimpleDb;
GO

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL, 
    FullName NVARCHAR(100),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE Tags (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    Slug VARCHAR(50) NOT NULL UNIQUE 
);
GO

CREATE TABLE Documents (
    Id BIGINT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Slug VARCHAR(250) NOT NULL UNIQUE, 
    Description NVARCHAR(MAX),
    
    FileUrl VARCHAR(500) NOT NULL,     -- Đường dẫn lưu trên ổ cứng/cloud
    FileHash VARCHAR(64) NOT NULL,     -- MD5 check trùng
    Extension VARCHAR(10) NOT NULL,    -- .pdf, .docx
    SizeInBytes BIGINT NOT NULL,       -- Dung lượng
    
    UploaderId INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Docs_User FOREIGN KEY (UploaderId) REFERENCES Users(Id)
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

CREATE INDEX IX_Documents_FileHash ON Documents(FileHash); -- Check trùng file
CREATE INDEX IX_Tags_Slug ON Tags(Slug); -- Tìm file theo tag nhanh