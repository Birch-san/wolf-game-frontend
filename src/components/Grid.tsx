import {useSelector} from "react-redux";
import {RootState} from "../store";
import React from "react";
import './Grid.css';
import {eqGrid, eqHunters, eqWolves, Hunter, Wolf} from "../slices";

interface PositionProps {
  x: number
  y: number
}
interface HunterTileProps extends PositionProps {
  username: string
}
interface WolfTileProps extends PositionProps {}

const PlayerTile: React.FC<WolfTileProps> = ({ x, y, children }) => {
  return (
    <div className="player" style={{
      translate: `${x}em ${y}em`
    }}>{children}</div>
  )
};

const HunterTile: React.FC<HunterTileProps> = ({ x, y, username }) => {
  const emoji = ((username: string): string => {
    if (username.length % 3 === 0) {
      return '🤷';
    } else {
      return '🙎';
    }
  })(username);

  return (
    <PlayerTile
      x={x}
      y={y}
    >
      <span role="img" aria-label="human">{emoji}</span>
    </PlayerTile>
  )
};

const WolfTile: React.FC<WolfTileProps> = ({ x, y }) => {
  return (
    <PlayerTile
      x={x}
      y={y}
    >
      <span role="img" aria-label="wolf">🐺</span>
    </PlayerTile>
  )
};

export const Grid: React.FC = () => {
  const grid = useSelector((state: RootState) => state.game.grid, eqGrid);
  const wolves = useSelector((state: RootState) => state.game.world.wolves, eqWolves);
  const hunters = useSelector((state: RootState) => state.game.world.hunters, eqHunters);

  return (
    <>
      {wolves.map((wolf: Wolf) => <WolfTile
        key={wolf.entity.id}
        x={wolf.entity.position!!.x}
        y={wolf.entity.position!!.y}
      />)}
      {hunters.map((hunter: Hunter) => <HunterTile
        key={hunter.entity.id}
        x={hunter.entity.position!!.x}
        y={hunter.entity.position!!.y}
        username={hunter.entity.user!!.name}
      />)}
      <table className="grid">
        <tbody>
        {
          grid.map((row, rowIx) => <tr key={rowIx}>
            {
              row.map((cell, colIx) => <td key={colIx}>
                {cell
                  ? <span role="img" aria-label="tree">🌲</span>
                  : <span role="img" aria-label="grass">🌱</span>
                }
              </td>)
            }
          </tr>)
        }
        </tbody>
      </table>
    </>
  );
}
