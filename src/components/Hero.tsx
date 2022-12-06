import { Cursor, useTypewriter } from 'react-simple-typewriter';

type Props = {};

export const Hero = (props: Props) => {
  const [text, count] = useTypewriter({
    words: [
      "Hi, I'm Marnoux", //
      "<I'm a web developer />",
      "I'm a father",
      "I'm a husband",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <div>
      <h1>
        <span>{text}</span>
        <Cursor cursorColor="#F7AB0A" />
      </h1>
    </div>
  );
};
