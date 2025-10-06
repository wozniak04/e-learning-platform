interface Props {
  name: string;
  id: number;
}

function Course(props: Props) {
  return (
    <>
      <div className="course">
        <h3>{props.name}</h3>
        <p>id: {props.id}</p>
      </div>
    </>
  );
}
export default Course;
