import {useSelector} from "react-redux";
import {RootState} from "../store";
import React from "react";
import './Grid.css';

export const Grid: React.FC = () => {
  const grid = useSelector((state: RootState) => state.game.grid);

  return (
    <table className="grid">
      <tbody>
      {
        grid.map((row, ix) => <tr key={ix}>
          {
            row.map((val, ix) => <td key={ix}>
              {val}
            </td>)
          }
        </tr>)
      }
      </tbody>
    </table>
  );
}
