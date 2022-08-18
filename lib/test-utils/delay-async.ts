export const delayAsync = (delayTime = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayTime)
  })
