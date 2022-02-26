import "./Keyboard.css";

const Keyboard = (props) => {
  const { clickedCallback } = props;

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
  ];

  return (
    <div className="Keyboard">
      {keyboardRows.map((row, idx) => (
        <div className="keyboardRow" key={`row${idx}`}>
          {row.map((letter, idx) => {
            if (letter === "") {
              return <div className="keySpacer" key={`spacer${idx}`}></div>;
            } else {
              return (
                <div
                  className={`Key ${letter.length > 1 && "wideKey"}`}
                  keystatus="open"
                  key={letter}
                  onClick={() => clickedCallback(letter)}
                >
                  <span>{letter}</span>
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
