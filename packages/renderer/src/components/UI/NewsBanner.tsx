import type {INewsData} from '../../types/NewsData';
import {isEmptyObject, openLinkOnBrowser} from '../../tools/utils';
import Button from './Button';

const NewsBanner = (props: INewsData) => {
  const {title, subtitle, link, cta} = props;

  return !isEmptyObject(props) ? (
    <div className="glass-card p-4 mb-4">
      <div className="flex flex-col">
        <h4>{title}</h4>
        <p style={{fontSize: 'medium', maxHeight: '60px'}}>{subtitle}</p>
        {cta && link && (
          <div>
            {link ? (
              <a
                onClick={() => openLinkOnBrowser(link)}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  text={cta || 'Learn more'}
                  style="primary"
                  className="mx-auto text-center"
                />
              </a>
            ) : (
              <Button
                text={cta || 'Learn more'}
                style="primary"
                className="mx-auto text-center"
              />
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default NewsBanner;
