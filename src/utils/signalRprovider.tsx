const BASE_URL = import.meta.env.VITE_SignalR_URL;
import { useEffect, createContext, useState, useRef } from "react";
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
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (connectionRef.current) return;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/notificationHub`, {
        accessTokenFactory: () => localStorage.getItem("accessToken") || "",
      })
      .withAutomaticReconnect()
      .build();
    connectionRef.current = connection;
    connection.on("ReceiveScanResult", (data) => {
      if (data.status === "Safe") {
        updateFileStatus(data.docIdDto, "success");
      } else {
        updateFileStatus(data.docIdDto, "error");
      }
    });
    connection
      .start()
      .then(() => {
        setSignalRConnectionId(connection.connectionId);
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));
    return () => {
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveScanResult");
        if (
          connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
          connectionRef.current.stop();
        }

        connectionRef.current = null;
      }
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ fileStatuses }}>
      {children}
    </SignalRContext.Provider>
  );
};
