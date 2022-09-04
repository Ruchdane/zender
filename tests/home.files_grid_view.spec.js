import { describe, expect, it } from "vitest";
import mq from "mithril-query";
import { FilesGridView } from "../src/view/home/FilesGridView";
import { MetadataType } from "../src/controller/file";
// import { mockIPC } from "@tauri-apps/api/mocks";
import { faker } from "@faker-js/faker";
// jsdom doesn't come with a WebCrypto implementation

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// function waitForUi(ms) {
//     return sleep(10 || ms);
// }

describe("home FilesGridView ", () => {
    it("Show a empty list item ", () => {
        const metadatas = [];
        const out = mq(FilesGridView, { metadatas });
        expect(out.find(".empty").length).toBe(1);
    })
    it("Show a list of loading item ", () => {
        const count = 20;
        const metadatas = Array.from(Array(count), () => undefined);
        const out = mq(FilesGridView, { metadatas });
        expect(out.find(".skeleton").length).toBe(count);
    })

    it("Show a list of loaded item ", () => {
        const { metadatas, count } = setup();
        const out = mq(FilesGridView, { metadatas, isSelected: () => false });
        expect(out.find(".file").length).toBe(count);
        metadatas.forEach(metadata => {
            out.contains(metadata.sysdata.basename)
        });
    })

    // TODO
    it("Allow you to select item", () => {
        let selectCount = 0;
        const { metadatas, count } = setup();
        const randomElementIndex = faker.datatype.number(count - 1);
        function onSelect(index) {
            expect(index).toBe(randomElementIndex)
            selectCount += 1;
        }
        const out = mq(FilesGridView, { metadatas, isSelected: () => false, onSelect });
        const randomElement = out.find(".file")[randomElementIndex];
        randomElement.click()
        expect(selectCount).toBe(1)
    })
    // TODO find how to emulate dblclick
    // it("Allow you to open an item", () => {
    //     const metadatas = [];
    //     const out = mq(FilesGridView, { metadatas });
    //     expect(out.find(".empty").length).toBe(1);
    // })

    it("Allows you to highlight selected item", () => {
        const { metadatas, count } = setup();
        const randomElementIndex = faker.datatype.number(count - 1);
        const out = mq(FilesGridView, { metadatas, isSelected: (index) => randomElementIndex === index });
        const randomElement = out.find(".file")[randomElementIndex];
        expect(randomElement.className).toBe("file selected")
    })
})

function setup(type) {
    const count = 20;
    const metadatas = Array.from(Array(count), () => {
        const metadataType = Object.values(MetadataType);
        type = type === undefined ? metadataType[faker.datatype.number(metadataType.length - 1)] : type;
        return {
            type,
            sysdata: {
                path: type === MetadataType.Folder ? faker.system.directoryPath() : faker.system.filePath(),
                basename: faker.system.fileName(),
            }
        };
    });
    return { metadatas, count };
}
// }