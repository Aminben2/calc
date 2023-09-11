import './App.css';
import React from 'react';
import DigitButton from './components/digitButton';
import OperationButton from './components/operationButton';
export const ACTIONS = {
  ADD_DIGIT: "add_digit",
  CHOSSE_OPERATION: "operation",
  CLEAR: "clear",
  DELETE: "delete",
  EVALUATE: "evaluate"
}
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.curentOperand === "0") return state
      if (payload.digit === "." && state.curentOperand == null) {
        return {
          ...state,
          curentOperand: `0.`
        }
      }
      if (payload.digit === "." && state.curentOperand.includes(".")) return state

      if (state.overwrite) {
        return {
          ...state,
          operation: null,
          previousOperand: null,
          curentOperand: payload.digit,
          overwrite: false
        }
      }
      return {
        ...state,
        overwrite: false,
        curentOperand: `${state.curentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CHOSSE_OPERATION:
      if (state.previousOperand == null && state.curentOperand == null) return state
      if (state.curentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.curentOperand,
          curentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        curentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE:
      if (state.curentOperand == null) return state
      if (state.curentOperand.length === 1) return { ...state, curentOperand: null }
      return {
        ...state,
        curentOperand: state.curentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.previousOperand == null && state.operation == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        operation: null,
        previousOperand: null,
        curentOperand: evaluate(state)
      }

    default: return state
  }
}
function evaluate({ curentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const curent = parseFloat(curentOperand)
  if (prev === null || curent === null || operation == null) return ""
  if (isNaN(prev) || isNaN(curent)) return ""
  let result = ""
  switch (operation) {
    case "+":
      result = prev + curent;
      break
    case "-":
      result = prev - curent;
      break
    case "*":
      result = prev * curent;
      break
    case "/":
      result = prev / curent;
      break
    default: result = curent
  }
  return result.toString()
}
function App() {
  const [{ curentOperand, previousOperand, operation }, dispatch] = React.useReducer(reducer, { curentOperand: null, previousOperand: null, operation: null })
  return (
    <div className="App">
      <div className="screen">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="curent-operand">{curentOperand}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>DEL</button>
      <OperationButton operation={"/"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button className='equal span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
