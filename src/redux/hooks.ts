import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./reducers";
import type { AppDispatch } from "./store";

// Components me plain useDispatch/useSelector ki jagah ye use karo, types apne aap milte hain
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
