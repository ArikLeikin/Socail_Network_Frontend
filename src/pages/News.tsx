import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactLoading from "react-loading";

function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getNewsData() {
      setLoading(true);
      try {
        const resp = await axios.get(
          "https://api.spaceflightnewsapi.net/v4/articles/"
        );
        const shuffledArticles = await shuffleArray(resp.data.results);
        setNewsData(shuffledArticles);
      } catch (error) {
        console.error("Error fetching news data:", error);
      } finally {
        setLoading(false);
      }
    }
    getNewsData();
  }, []);

  async function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          <ReactLoading
            type={"balls"}
            color={"#000000"}
            height={"2%"}
            width={"2%"}
          />
        ) : (
          <Container>
            {newsData.map((newsItem, index) => (
              <Row className="d-flex justify-content-center" key={index}>
                <Col
                  xs={12}
                  className="d-flex justify-content-center mt-5 w-700"
                >
                  <Card>
                    <a
                      className="d-flex flex-column justify-content-center"
                      target="_blank"
                      rel="noreferrer"
                      href={newsItem.url}
                    >
                      <Card.Title className="my-3">{newsItem.title}</Card.Title>
                      <Card.Img src={newsItem.image_url} />
                      <Card.Body>
                        <Card.Text>{newsItem.summary}</Card.Text>
                      </Card.Body>
                    </a>
                  </Card>
                </Col>
              </Row>
            ))}
          </Container>
        )}
      </header>
    </div>
  );
}

export default News;
