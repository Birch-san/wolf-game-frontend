import * as React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../store";

// interface Props {
//   numberCollection: number[];
// }

export const NumberViewerComponent: React.FunctionComponent = () => {
  const numberCollection = useSelector((state: RootState) => state.numberCollection)
  return <>
    <h5>Generated numbers collection:</h5>
    <ul>
      {numberCollection.map(currentNumber => (
        <li key={currentNumber}>{currentNumber}</li>
      ))}
    </ul>
  </>
};
