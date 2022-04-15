import React from "react";
import Select from "react-select";
import "./navbar.styles.scss";

const Navbar = ({ userLang, setUserLang }) => {
  const languages = [
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];
  //   const themes = [
  //     { value: "vs-dark", label: "Dark" },
  //     { value: "light", label: "Light" },
  //   ];
  return (
    <div className="navbar">
      <Select
        styles={{ color: "black" }}
        options={languages}
        value={userLang}
        onChange={(e) => setUserLang(e.value)}
        placeholder={userLang}
      />
    </div>
  );
};

export default Navbar;
