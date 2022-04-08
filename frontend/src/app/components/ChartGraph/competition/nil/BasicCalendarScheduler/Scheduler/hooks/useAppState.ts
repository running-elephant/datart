import { useContext } from "react";
import { stateContext, StateContext } from "../context/state/stateContext";

const useAppState = (): stateContext => {
  const state = useContext(StateContext);

  return state;
};

export { useAppState };
