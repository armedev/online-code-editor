import "./App.scss";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import Navbar from "./navbar.component";
import axios from "axios";
import { encode, decode } from "base-64";

function App() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cinput, setCInput] = useState("");
  const [tab, setTab] = useState("input");

  const languageMap = {
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
  };

  const handleSubmit = async () => {
    if (code.length < 1) return;
    setLoading(true);
    console.log(languageMap[language]);
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "27eb090093msh7a4a8ded32ffa11p1dba82jsn0c8213b2535c",
      },
      data: JSON.stringify({
        language_id: languageMap[language],
        source_code: encode(code),
        stdin: encode(cinput),
      }),
    };

    await axios
      .request(options)
      .then(function (response) {
        const { token } = response.data;
        if (!token) return;
        setTab("output");
        const options = {
          method: "GET",
          url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key":
              "27eb090093msh7a4a8ded32ffa11p1dba82jsn0c8213b2535c",
          },
        };

        axios
          .request(options)
          .then(function (response) {
            if (!response.data.stdout)
              setOutput(response.data.status.description);
            else setOutput(decode(response.data.stdout));
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="left">
        <div className="left__header">Trim a Binary Search Tree</div>
        <div className="left__body">
          <div className="left__body__question">
            <span>
              Given the root of a binary search tree and the lowest and highest
              boundaries as low and high, trim the tree so that all its elements
              lies in [low, high]. Trimming the tree should not change the
              relative structure of the elements that will remain in the tree
              (i.e., any node's descendant should remain a descendant). It can
              be proven that there is a unique answer. <br />
              Return the root of the trimmed binary search tree. Note that the
              root may change depending on the given bounds.
            </span>
          </div>
          <div className="left__body__test">Example Test cases</div>
        </div>
      </div>
      <div className="right">
        <Navbar setUserLang={setLanguage} userLang={language} />
        <Editor
          defaultLanguage="python"
          language={language}
          value={code}
          height="70%"
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
        <div className="right__bottom">
          <div>
            <div
              style={tab === "input" ? { opacity: 1 } : { opacity: 0.7 }}
              onClick={() => setTab("input")}
            >
              Custom Input
            </div>
            <div
              style={tab === "output" ? { opacity: 1 } : { opacity: 0.7 }}
              onClick={() => setTab("output")}
            >
              Output
            </div>
          </div>
          <button
            style={
              loading
                ? { cursor: "wait", opacity: 0.5 }
                : { cursor: "pointer", opacity: 1 }
            }
            onClick={handleSubmit}
          >
            Run
          </button>
        </div>
        {tab === "input" ? (
          <div className="right__input">
            <textarea
              value={cinput}
              onChange={({ target }) => setCInput(target.value)}
            />
          </div>
        ) : (
          <div className="right__output">{output}</div>
        )}
      </div>
    </div>
  );
}

export default App;
