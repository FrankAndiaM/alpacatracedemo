export const loadState = () => {
  try {
    const serializedState: string | null = localStorage.getItem('state');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (error) {}
};

export const deleteState = () => {
  try {
    localStorage.removeItem('state');
  } catch (error) {}
};
