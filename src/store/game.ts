import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Position {
  y: number
  x: number
}

export interface Hunter {
  pos: Position
}

export interface Wolf {
  pos: Position
}

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    wolves: [] as Wolf[],
    hunters: [] as Hunter[],
  },
  reducers: {
    moveWolf(state, action: PayloadAction<Position>) {
      // state.hunters[0].pos.y++
    }
  }
})

const { actions, reducer } = gameSlice
export const { moveWolf } = actions
export { reducer as gameReducer }
