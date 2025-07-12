import { Navigate, useParams } from "react-router-dom";

type TRoomParams = {
  roomId: string;
};

export function Room() {
  const params = useParams<TRoomParams>();

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return <div>Room Details {JSON.stringify(params)}</div>;
}
