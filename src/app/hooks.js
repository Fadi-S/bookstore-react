import { useDispatch, useSelector } from "react-redux";

// Abstracts the useDispatch hook
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;