import {useSelector} from "react-redux";
import {RootState} from "../store";
import React from "react";
import styles from './Grid.module.scss';
import {eqGrid, eqHunters, eqWolves, Hunter, Wolf} from "../slices";
import {inspect} from "util";

interface PositionProps {
  x: number
  y: number
  isYou: boolean
  isAlive: boolean
}
interface HunterTileProps extends PositionProps {
  username: string
  bited: boolean
  petting: boolean
}
interface WolfTileProps extends PositionProps {
  biting: boolean
  petted: boolean
}

const PlayerTile: React.FC<PositionProps> = ({ x, y, isYou, isAlive, children }) => {
  return (
    <div className={`${styles.player} ${isYou ? styles.you : ''}`} style={{
      transform: `translate(${x}em, ${y}em)`
    }}>{children}</div>
  )
};

const HunterTile: React.FC<HunterTileProps> = ({ x, y, username, bited, petting, isYou, isAlive }) => {
  const emoji = ((username: string): string => {
    if (!isAlive) {
      return '💀'
    }
    if (bited) {
      return '😧'
    }
    if (petting) {
      return '🙋'
    }
    if (username.codePointAt(username.length-1)!! % 3 === 0) {
      return '🤷'
    }
    return '🙎'
  })(username);

  return (
    <PlayerTile
      x={x}
      y={y}
      isYou={isYou}
      isAlive={isAlive}
    >
      <span role="img" aria-label="human">{emoji}</span>
    </PlayerTile>
  )
};

const WolfTile: React.FC<WolfTileProps> = ({ x, y, biting, petted, isYou, isAlive }) => {
  const emoji = ((): string => {
    if (!isAlive) {
      return '💀'
    }
    if (petted) {
      return '🐶'
    }
    if (biting) {
      return '🧛'
    }
    return '🐺'
  })();

  return (
    <PlayerTile
      x={x}
      y={y}
      isYou={isYou}
      isAlive={isAlive}
    >
      <span role="img" aria-label="wolf">{emoji}</span>
    </PlayerTile>
  )
};

export const Grid: React.FC = () => {
  const grid = useSelector((state: RootState) => state.game.grid, eqGrid);
  const wolves = useSelector((state: RootState) => state.game.world.wolves, eqWolves);
  const hunters = useSelector((state: RootState) => state.game.world.hunters, eqHunters);
  // const you = wolves.find((wolf: Wolf) => wolf.player.isYou)
  //   || hunters.find((hunter: Hunter) => hunter.player.isYou);

  return (
    <>
      {hunters.map((hunter: Hunter) => <HunterTile
        key={hunter.entity.id}
        x={hunter.entity.position!!.x}
        y={hunter.entity.position!!.y}
        username={hunter.entity.user!!.name}
        bited={!!hunter.bitedTicks}
        petting={!!hunter.petTicks}
        isYou={hunter.player.isYou}
        isAlive={hunter.player.alive}
      />)}
      {wolves.map((wolf: Wolf) => <WolfTile
        key={wolf.entity.id}
        x={wolf.entity.position!!.x}
        y={wolf.entity.position!!.y}
        biting={!!wolf.biteTicks}
        petted={!!wolf.pettedTicks}
        isYou={wolf.player.isYou}
        isAlive={wolf.player.alive}
      />)}
      <table className={styles.grid}>
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
