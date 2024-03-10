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
          "https://newsapi.org/v2/everything?q=technology&apiKey=b738ed2669c54125aae96fba7c1107d5&pageSize=50"
        );
        setNewsData(resp.data.articles);
      } catch (error) {
        console.error("Error fetching news data:", error);
      } finally {
        setLoading(false);
      }
    }
    getNewsData();
  }, []);

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
                <Col xs={12} className="mt-5 w-700">
                  <a
                    className="d-flex justify-content-center"
                    target="_blank"
                    rel="noreferrer"
                    href={newsItem.url}
                  >
                    <Card>
                      <Card.Title className="my-3">{newsItem.title}</Card.Title>
                      <Card.Img src={newsItem.urlToImage} />
                      <Card.Body>
                        <Card.Text>{newsItem.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </a>
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
