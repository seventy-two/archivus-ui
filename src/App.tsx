import React, { useState, useEffect } from 'react';
import './App.css';
import { css } from 'emotion';

const buttonStyle = css`
  position: sticky;
  display: flex;
  flex-direction: column;
  color: white;
  border: 1px solid black;
  align-items: baseline;
  width: 100%;
  text-shadow: black -1px 0px, black 0px 1px, black 1px 0px, black 0px -1px;
  box-shadow: rgba(0, 0, 0, 0.8) 0px -8px 8px inset;
  background: #111;
  height: 75px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 16px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.5) 5000px -8px 8px inset;
  }
`;

const buttonContainerStyle = css`
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const eventDetailStyle = css`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-left: 20%;
  top: 0;
  left: 0;
  z-index: 999;
  width: 80%;
`;

const comicsStyle = css`
  display: flex;
  flex-wrap: wrap;
  float: right;
  margin-left: 50px;
  margin-right: 50px;
`;

const comicStyle = css`
  color: #fff;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  background: #232323;
  text-align: center;
  padding: 15px;
  max-width: 180px;
  min-width: 180px;
`;

const imgStyle = css`
  height: 255px;
  min-height: 255px;
`;

const eventDescriptionStyle = css`
  font-size: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #222;
  color: #fff;
`;

const eventTitleStyle = css`
  padding: 20px;
  font-size: 40px;
  font-weight: bold;
  background: transparent;
  color: #fff;
  text-transform: uppercase;
`;

const comicTitleStyle = css`
  margin-top: 10px;
`;

const smallPrintStyle = css`
  text-align: right;
  font-size: 8px;
`;

const buttonPaneStyle = css`
  position: fixed;
  width: 20%;
  overflow-y: scroll;
  max-height: 100vh;
`;

const App: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [eventData, setEventData] = useState<any | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch('https://0x48.io/archivus/getEvents')
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response);
        setData(response);
      });
  }, []);

  const fetchEvent = (id: string) => {
    const url = 'https://0x48.io/archivus/eventComicsByEventID/' + id;
    console.log(url);
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response);
        setEventData(response);
      });
  };

  const handleOnClick = (event: any) => () => {
    setSelected(selected === event.ID ? null : event.ID);
    setEventData(null);
    fetchEvent(event.ID);
    window.scrollTo(0, 0);
  };

  if (data === null) {
    return null;
  }

  return (
    <>
      <div className={buttonPaneStyle}>
        {data.map((event: any) => {
          return (
            <div className={buttonContainerStyle}>
              <button
                key={event.ID}
                className={buttonStyle}
                onClick={handleOnClick(event)}
                style={{
                  background: `url('./${event.ID}.png`
                }}
              >
                {event.Title}
              </button>
            </div>
          );
        })}
      </div>
      {!(selected === null) &&
        !(eventData === null) &&
        !(eventData.Comics === null) && (
          <>
            <div className={eventDetailStyle}>
              <div className={eventTitleStyle}>{eventData.Name}</div>
              <div className={eventDescriptionStyle}>
                {eventData.Description}
                <br />
                <div className={smallPrintStyle}>
                  Data provided by Marvel. © 2019 MARVEL
                </div>
              </div>
              <div className={comicsStyle}>
                {eventData.Comics.map((comic: any) => {
                  const imgSrc = comic.Image.replace(
                    '.jpg',
                    '/portrait_xlarge.jpg'
                  );
                  return (
                    <>
                      <div className={comicStyle}>
                        <a href={comic.URL}>
                          <img
                            src={imgSrc}
                            className={imgStyle}
                            alt={comic.Title}
                          />
                        </a>
                        <div className={comicTitleStyle}>{comic.Title}</div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </>
        )}
      {selected === null && (
        <>
          <div className={eventDetailStyle}>
            <div className={eventTitleStyle}>Archivus</div>
            <div className={eventDescriptionStyle}>
              Archivus is a reading list retrival and building tool, primarily
              for Marvel comic events.
              <br /> Select an event to continue. It's highly suggested you pair
              Archivus with Marvel Unlimited, which allows you to read comics
              online.
              <br /> Archivus links directly to Marvel Unlimited.
              <br />
              <br />
              <div className={smallPrintStyle}>
                Data provided by Marvel. © 2019 MARVEL
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
