'use client';

import React from "react";
import Typewriter from "typewriter-effect";

const TypewriterTitle = () => {
  return (
    <Typewriter
      options={{
        loop: true,
        autoStart: true,
        delay: 60,        // typing speed
        deleteSpeed: 30,  // deletion speed
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString("\u2604\uFE0F Supercharged Productivity.") // ☄️
          .pauseFor(1200)
          .deleteAll()
          .pauseFor(100)
          .typeString("\u2604\uFE0F \u{1F916} AI-Powered Insights.")         // ☄️ 🤖
          .pauseFor(1200)
          .deleteAll()
          .start();
      }}
    />
  );
};

export default TypewriterTitle;
