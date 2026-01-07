const BASE_URL = import.meta.env.VITE_API_URL;
import { useEffect, createContext, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useStore } from "../zustand/store";
const SignalRContext = createContext<{
  fileStatuses: Record<string, string>;
} | null>(null);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fileStatuses] = useState({});
  const { updateFileStatus, setSignalRConnectionId } = useStore();
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/notificationHub`, {
        accessTokenFactory: () => localStorage.getItem("accessToken") || "",
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveScanResult", (data) => {
      if (data.status === "Safe") {
        updateFileStatus(data.docIdDto, "success");
      } else {
        updateFileStatus(data.docIdDto, "error");
      }
    });
    connection
      .start()
      .then(() => setSignalRConnectionId(connection.connectionId))
      .catch((err) => console.error("SignalR Connection Error: ", err));
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ fileStatuses }}>
      {children}
    </SignalRContext.Provider>
  );
};
