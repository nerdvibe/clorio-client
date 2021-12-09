import isElectron from "is-electron";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import Button from "../../components/UI/Button";
import Logo from "../../components/UI/logo/Logo";

interface IProps {
  mnemonic: string;
  closeVerification: () => void;
  completeRegistration: () => void;
  storePassphraseHandler: () => void;
  storePassphrase?: boolean;
}

export const VerifyMnemonic = ({
  mnemonic,
  closeVerification,
  completeRegistration,
  storePassphraseHandler,
  storePassphrase,
}: IProps) => {
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [wordsFoundArray, setWordsFoundArray] = useState<string[]>([]);

  /**
   * Generate an array containing 4 to 12 words positions to be guessed
   * @returns number[]
   */
  const selectRandomIndexes = () => {
    const numberOfWords = 3;
    const randomIndexes: any[] = [];
    while (randomIndexes.length <= numberOfWords) {
      const tmpIndex = Math.floor(1 + Math.random() * 12);
      if (!randomIndexes.includes(tmpIndex)) {
        randomIndexes.push(tmpIndex);
      }
    }
    return randomIndexes.sort();
  };
  const [removedIndex] = useState<number[]>(selectRandomIndexes());

  /**
   * Generate an array containing all the passphrase words except the randomly removed words
   * @returns string|null[]
   */
  const removeWords = () => {
    const newPassphrase = [];
    const passphraseSplit = mnemonic.split(" ");
    for (const index in passphraseSplit) {
      if (removedIndex.includes(parseInt(index) + 1)) {
        newPassphrase.push(null);
      } else {
        newPassphrase.push(passphraseSplit[index]);
      }
    }
    return newPassphrase;
  };

  /**
   * Check if the word is included inside the original passphrase and the position is correct.
   * If all the words have been found, enable the proceed button.
   * @param index index of the word
   * @param word input word
   */
  const validateWord = (index: number, word: string) => {
    const wordsFound = wordsFoundArray;
    const splitWords = mnemonic.split(" ");
    if (splitWords[index] === word) {
      wordsFound.push(word);
    } else {
      if (wordsFound.includes(splitWords[index])) {
        const wordIndex = wordsFound.indexOf(splitWords[index]);
        wordsFound.splice(wordIndex, 1);
      }
    }
    setWordsFoundArray(wordsFound);
    if (!disableButton) {
      if (wordsFound.length !== removedIndex.length) {
        setDisableButton(true);
      }
    } else {
      if (wordsFound.length === removedIndex.length) {
        setDisableButton(false);
      }
    }
  };

  return (
    <div className="block-container no-bg real-full-page-container center ">
      <div className="">
        <Row>
          <Col xs={8} className="offset-md-2 full-width-align-center">
            <Logo big={true} />
            <div className="v-spacer" />
            <div className="v-spacer" />
            <h4 className="full-width-align-center strong">
              Verify your passphrase
            </h4>
            <div className="v-spacer" />
            <div className="verification-container">
              <Row>
                {removeWords().map((el, index) => {
                  return el !== null ? (
                    <Col xs={3} key={index} className="validation-word-box">
                      <span className="validation-index">{index + 1}.</span>{" "}
                      <span className="validation-word">{el}</span>
                    </Col>
                  ) : (
                    <Col xs={3} key={index} className="validation-word-box">
                      <span className="validation-index">{index + 1}.</span>{" "}
                      <input
                        className="validation-input"
                        onChange={(e) =>
                          validateWord(index, e.currentTarget.value)
                        }
                        autoComplete="off"
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className="v-spacer" />
            <div>
              <span
                data-tip={
                  !isElectron()
                    ? "Feature enabled only on the desktop version"
                    : undefined
                }
              >
                <input
                  className="checkbox"
                  type="checkbox"
                  name="storePassphrase"
                  id="storePassphrase"
                  value={isElectron() ? "show" : ""}
                  onChange={storePassphraseHandler}
                  checked={storePassphrase}
                  disabled={!isElectron()}
                />
                <label
                  className="ml-2 checkbox-label"
                  htmlFor="storePassphrase"
                >
                  Store my passphrase for this session
                </label>
              </span>
            </div>
            <Row>
              <Col xs={6}>
                <Button
                  className="link-button"
                  text="Go back"
                  onClick={() => closeVerification()}
                />
              </Col>
              <Col>
                <Button
                  className={"lightGreenButton__fullMono margin-auto"}
                  text="Next step"
                  link={"/overview"}
                  onClick={completeRegistration}
                  disabled={disableButton}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <ReactTooltip />
    </div>
  );
};
