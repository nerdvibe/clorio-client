import {Row, Col} from 'react-bootstrap';
// @ts-ignore Missing interface
import React, {LegacyRef, ReactNode, forwardRef} from 'react';

interface IProps {
  avatar?: React.ReactNode;
  className?: string;
  header: string;
  text?: string | ReactNode;
  website?: string;
}

const StakeTableValue = forwardRef(function StakeTableValue(props: IProps, ref) {
  const {avatar, className, header, text, website} = props;
  if (avatar) {
    return (
      <td
        className={className}
        ref={ref as LegacyRef<HTMLTableCellElement>}
      >
        <div>
          <Row className="stake-row-value">
            <Col
              sm={12}
              className="small-screen-stake-table-text"
            >
              <div className="inline-block-element">{avatar}</div>
              <div className="inline-block-element">
                <p className="secondaryText no-bottom selectable-text">{header}</p>
                <h5 className="selectable-text">{text}</h5>
              </div>
            </Col>
          </Row>
        </div>
      </td>
    );
  }
  if (header.toLowerCase() === 'info') {
    return (
      <td
        className={className}
        ref={ref as LegacyRef<HTMLTableCellElement>}
      >
        <div>
          <Row className="stake-row-value">
            <Col
              sm={9}
              className="small-screen-stake-table-text"
            >
              <p className="secondaryText no-bottom">{header}</p>
              {website ? (
                <a
                  href={`${website}?ref=clorio`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text}
                </a>
              ) : null}
            </Col>
          </Row>
        </div>
      </td>
    );
  }

  return (
    <td
      className={className}
      ref={ref as LegacyRef<HTMLTableCellElement>}
    >
      <div>
        <Row className="stake-row-value">
          <Col
            sm={9}
            className="small-screen-stake-table-text"
          >
            <p className="secondaryText no-bottom">{header}</p>
            <h5>{text}</h5>
          </Col>
        </Row>
      </div>
    </td>
  );
});

export default StakeTableValue;
