import { cache } from "../../Cache.js";
import { Export } from "../../Tab/Action/Export.js"

function exportTests(){
    test("Document was not created\n", () => {

        var content = $('#editor')[0].outerHTML;
        filename = "testerfile";
        expect(Export(content, filename, SVGUnitTypes).tobe('false'))
    });

    test("Document was created\n", () => {

        var content = $('#editor')[0].outerHTML;
        filename = "testerfile";
        expect(Export(content, filename, SVGUnitTypes).tobe('true'))
    });

}
