import * as React from 'react';
import {useDispatch} from "react-redux";
import {numberRequestStartAction} from "../../slices";
// import {numberRequestStartAction} from "../../actions";

// interface Props {
//   onRequestNewNumber: () => void;
// }

// type use

// const onRequestNewNumber = (dispatch: ReturnType<typeof useDispatch<>) => dispatch(numberRequestStartAction());

export const NumberSetterComponent: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const onRequestNewNumber = () => dispatch(numberRequestStartAction());
  return <button onClick={onRequestNewNumber}>Request new number</button>
};
