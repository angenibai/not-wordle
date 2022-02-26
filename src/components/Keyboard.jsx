import "./Keyboard.css";

const Key = (props) => {
  const { letter, status } = props;

  return (
    <div className={`Key ${status}-key`}>
      <span>{letter}</span>
    </div>
  );
};

const Keyboard = (props) => {
  const { clickedCallback } = props;

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className="Keyboard">
      {keyboardRows.map((row) => (
        <div className="keyboardRow">
          {row.map((letter) => (
            <Key letter={letter} status="unclicked" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
