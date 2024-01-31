import { Row, Col } from "react-bootstrap";
import { INewsData } from "../../types/NewsData";
import { isEmptyObject } from "../../tools/utils";
import Button from "./Button";

const NewsBanner = (props: INewsData) => {
  const { title, subtitle, link, cta, visible } = props;

  return !isEmptyObject(props) && visible ? (
    <div className="glass-card p-4 mt-2 mb-2">
      <Row>
        <Col md={8} lg={8} xl={9}>
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </Col>
        {cta && link && (
          <Col className="align-end ml-auto pt-20p">
            {link ? (
              <a href={link} target="_blank" rel="noreferrer">
                <Button
                  text={cta || "Learn more"}
                  style="primary"
                  className="mx-auto text-center"
                />
              </a>
            ) : (
              <Button
                text={cta || "Learn more"}
                style="primary"
                className="mx-auto text-center"
              />
            )}
          </Col>
        )}
      </Row>
    </div>
  ) : (
    <></>
  );
};

export default NewsBanner;
