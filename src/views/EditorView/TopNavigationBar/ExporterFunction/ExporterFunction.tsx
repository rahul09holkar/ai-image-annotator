import { connect } from "react-redux";
import { AppState } from "src/store";
import { COCOExporter } from "../../../../logic/export/polygon/COCOExporter";
const ExporterFunction: React.FC = () => {
  const style: React.CSSProperties = {
    top: 35,
    cursor: "pointer",
  };

  const onAccept = () => {
    const response = COCOExporter.returnJson();
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("d");
    const decodedString = atob(encodedData);
    const jsonData = JSON.parse(decodedString);
    debugger
  };
  return (
    <div
      style={style}
      onClick={() => {
        onAccept();
      }}
    >
      <div className="Marker" />
      Save
    </div>
  );
};
const mapDispatchToProps = {};
const mapStateToProps = (state: AppState) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ExporterFunction);
