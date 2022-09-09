import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

function App() {
    const [From, setFrom] = useState("fr");
    const [To, setTo] = useState("en");
    const [text, setText] = useState("");
    const [translated, setTranslated] = useState("");
    const [languages, setLanguages] = useState();
    const [ispending, setIsPending] = useState(false);

    const languageNames = new Intl.DisplayNames(["en"], {
        type: "language",
    });

    const headers = {
        "content-type": process.env.REACT_APP_CONTENT_TYPE,
        "Accept-Encoding": process.env.REACT_APP_ACCEPT_ENCODING,
        "X-RapidAPI-Key": process.env.REACT_APP_X_RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
    };

    const detect = (e) => {
        setText(e.target.value);
        //this checks the language

        // const encodedParams = new URLSearchParams();
        // encodedParams.append("q", text);

        // const options = {
        //   method: 'POST',
        //   headers: headers ,
        //   body: encodedParams
        // };

        // fetch('https://google-translate1.p.rapidapi.com/language/translate/v2/detect', options)
        //   .then(response => response.json())
        //   .then(response => console.log(response.data.detections[0][0].language))
        //   .catch(err => console.error(err));
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            // 👇️ your logic here
            // console.log("Enter key pressed ✅");
            handlesubmit(event);
        }
    };

    const handleKeyPressReverse = (event) => {
        if (event.key === "Enter") {
            // 👇️ your logic here
            // console.log("Enter key pressed ✅");
            handlesubmitreverse(event);
        }
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        setIsPending(true);
        // this translates the given text

        const encodedParams = new URLSearchParams();
        encodedParams.append("q", text);
        encodedParams.append("target", To);
        encodedParams.append("source", From);

        const options = {
            method: "POST",
            headers: headers,
            body: encodedParams,
        };

        fetch(
            "https://google-translate1.p.rapidapi.com/language/translate/v2",
            options
        )
            .then((response) => response.json())
            .then((response) => {
                setTranslated(response.data.translations[0].translatedText);
                setIsPending(false);
            })
            .catch((err) => {
                setIsPending(false);
                console.error(err);
            });
    };
    const handlesubmitreverse = (e) => {
        e.preventDefault();
        setIsPending(true);
        // this translates the given text

        const encodedParams = new URLSearchParams();
        encodedParams.append("q", translated);
        encodedParams.append("source", To);
        encodedParams.append("target", From);

        const options = {
            method: "POST",
            headers: headers,
            body: encodedParams,
        };

        fetch(
            "https://google-translate1.p.rapidapi.com/language/translate/v2",
            options
        )
            .then((response) => response.json())
            .then((response) => {
                setText(response.data.translations[0].translatedText);
                setIsPending(false);
            })
            .catch((err) => {
                setIsPending(false);
                console.error(err);
            });
    };

    useEffect(() => {
        //get all the languages
        const options = {
            method: "GET",
            headers: headers,
        };
        console.log("here");
        fetch(
            "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
            options
        )
            .then((response) => response.json())
            .then((response) => setLanguages(response.data.languages))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="App">
            <h1 style={{ fontFamily: "sans-serif", color: "green" }}>
                Translate
            </h1>
            <div className="translate-main">
                <div className="form">
                    <form onSubmit={handlesubmit}>
                        <div className="lang">
                            <div className="select" style={{ width: "100px" }}>
                                <select
                                    value={From}
                                    onChange={(e) => setFrom(e.target.value)}
                                    name=""
                                    id=""
                                >
                                    <option disabled value="select">
                                        language
                                    </option>
                                    {languages &&
                                        languages.map((language, index) => (
                                            <option
                                                key={index}
                                                value={language.language.toString()}
                                            >
                                                {languageNames.of(
                                                    language.language.toString()
                                                )}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="language">Detect</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <textarea
                                required
                                value={text}
                                onKeyUp={handleKeyPress}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter Text to translate"
                            ></textarea>
                        </div>
                        <div
                            style={{
                                textAlign: "right",
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            {!ispending && <button>Translate</button>}
                            {ispending && (
                                <button disabled>Translating...</button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="translation">
                    <div className="to">
                        <h3 style={{ margin: "0px", color: "#999" }}>
                            Translation
                        </h3>
                        <div className="select" style={{ width: "100px" }}>
                            <select
                                value={To}
                                onChange={(e) => setTo(e.target.value)}
                                name=""
                                id=""
                            >
                                <option disabled value="">
                                    language
                                </option>
                                {languages &&
                                    languages.map((language, index) => (
                                        <option
                                            key={index}
                                            value={language.language.toString()}
                                        >
                                            {languageNames.of(
                                                language.language.toString()
                                            )}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <textarea
                            required
                            value={translated}
                            onKeyUp={handleKeyPressReverse}
                            onChange={(e) => setTranslated(e.target.value)}
                            placeholder="Translate to see here"
                        ></textarea>
                        <div
                            style={{
                                textAlign: "right",
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            {!ispending && (
                                <button onClick={handlesubmitreverse}>
                                    Translate
                                </button>
                            )}
                            {ispending && (
                                <button disabled>Translating...</button>
                            )}
                        </div>
                    </div>
                    {/* <p>{translated}</p> */}
                </div>
            </div>
        </div>
    );
}

export default App;
