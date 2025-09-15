import Modules from "../Modules/page";
import CourseStatus from "./status";
export default function Home() {
  return (
    <div id="wd-home">
      <table>
        <tbody>
          <tr>
            <button>
              Collapese All
            </button>
            <button>
              View Progress
            </button>
            <select defaultValue={"Publish All"}>
              <option value="Publish All">
                Publish All
              </option>
              <option value="Hide All">
                Hide All
              </option>
            </select>
            <button>
              + Module
            </button>
          </tr>
          <tr>
            <td valign="top" width="70%"> <Modules /> </td>
            <td valign="top"> <CourseStatus /> </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
