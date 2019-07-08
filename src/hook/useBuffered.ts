type Callback = (...args: any[]) => void

export const useBuffered = (callback: Callback, timeout: number = 500) => {
  let timer: NodeJS.Timeout

  return (...args: any[]) => {
    clearTimeout(timer)

    timer = setTimeout(() => callback(...args), timeout)
  }
}
