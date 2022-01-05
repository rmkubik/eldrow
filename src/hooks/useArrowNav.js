import useKeyPress from "./useKeyPress";

const useArrowNav = ({ focusedLocation, wordleMatrix }) => {
  useKeyPress(
    {
      ArrowUp: (e) => {
        e.preventDefault();

        if (focusedLocation) {
          document
            .getElementById(
              JSON.stringify({
                row: Math.max(focusedLocation.row - 1, 0),
                col: focusedLocation.col,
              })
            )
            .focus();
        }
      },
      ArrowDown: (e) => {
        e.preventDefault();

        if (focusedLocation) {
          document
            .getElementById(
              JSON.stringify({
                row: Math.min(focusedLocation.row + 1, wordleMatrix.length - 1),
                col: focusedLocation.col,
              })
            )
            .focus();
        }
      },
      ArrowLeft: (e) => {
        e.preventDefault();

        if (focusedLocation) {
          document
            .getElementById(
              JSON.stringify({
                row: focusedLocation.row,
                col: Math.max(focusedLocation.col - 1, 0),
              })
            )
            .focus();
        }
      },
      ArrowRight: (e) => {
        e.preventDefault();

        if (focusedLocation) {
          document
            .getElementById(
              JSON.stringify({
                row: focusedLocation.row,
                col: Math.min(
                  focusedLocation.col + 1,
                  wordleMatrix[0].length - 1
                ),
              })
            )
            .focus();
        }
      },
    },
    [focusedLocation, wordleMatrix]
  );
};

export default useArrowNav;
