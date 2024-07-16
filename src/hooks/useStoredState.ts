import * as React from 'react'

const storage =
  typeof window === 'undefined'
    ? {
        getItem: () => null,
        setItem: () => null,
        removeItem: () => null,
      }
    : window.localStorage

const useStoredState = <T>(
  key: string, // If the key change it will not work properly
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const valueFromStorage = storage.getItem(key)
  const [state, setState] = React.useState<T>(
    valueFromStorage !== null ? JSON.parse(valueFromStorage) : defaultValue,
  )

  const updateStorage: React.Dispatch<React.SetStateAction<T>> =
    React.useCallback(
      (newValueOrFunction: T | ((value: T) => T)) => {
        const isFunction = (
          newValueOrFunction: T | ((value: T) => void),
        ): newValueOrFunction is (value: T) => void =>
          typeof newValueOrFunction === 'function'
        if (isFunction(newValueOrFunction)) {
          setState((oldValue) => {
            const newValue = newValueOrFunction(oldValue)
            const stringifiedValue = JSON.stringify(newValue)
            storage.setItem(key, stringifiedValue)
            return newValue
          })
        } else {
          setState(newValueOrFunction)
          const stringifiedValue = JSON.stringify(newValueOrFunction)
          storage.setItem(key, stringifiedValue)
        }
      },
      [key],
    )

  return React.useMemo(() => [state, updateStorage], [state, updateStorage])
}

export default useStoredState
