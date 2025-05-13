import styled from "styled-components";

const Card = styled.div`
  padding: 20px;
  background-color: #eef;
  border-radius: 12px;
  margin: 20px;
  text-align: center;
`;

function HelloCard() {
  return (
    <Card>
      <h2>Hello from Styled Component!</h2>
    </Card>
  );
}

export default HelloCard;
