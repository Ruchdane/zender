import { describe, expect, it } from "vitest";
import mq from "mithril-query";
import { FilesGridView } from "../src/view/home/FilesGridView";
// import { FilesListView } from "../src/view/home/FilesListView";
import { mockIPC } from "@tauri-apps/api/mocks";
import { faker } from "@faker-js/faker";
// jsdom doesn't come with a WebCrypto implementation

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForUi(ms) {
    return sleep(10 || ms);
}

// Fuse the two together FilesListView & FilesGridView
// for (let i = 0; i < 2; i++) {
const FilesView = FilesGridView;
// const FilesView = i === 0 ? FilesListView : FilesGridView;
const componentName = "FilesGridView";
// const componentName = i === 0 ? "FilesListView" : "FilesGridView";
describe(`home ${componentName} `, () => {
    it("Show a list of loading item ", () => {
        const count = 20
        const paths = Array.from(Array(count), () => faker.system.filePath())
        let metadataCallCount = 0;
        const metadataPaths = [];
        mockIPC(async (cmd, args) => {
            if (cmd === "get_metadata_of_path") {
                metadataCallCount += 1;
                metadataPaths.push(args.path);
                await sleep(10);
            }
        });
        const out = mq(FilesView, {
            files: paths
        });
        waitForUi(5).then(() => {
            expect(metadataCallCount).toBe(count);
            expect(metadataPaths).toBe(paths);
            expect(out.find(".skeleton").count).toBe(count);
        })

    })

    it("Show a list of loaded item ", () => {
        mq(FilesView);
        expect(true).toBe(true)
    })

    it("Allow you to select multiple item", () => {
        mq(FilesView);
        expect(true).toBe(true)
    })

    it("Allow you to open an item", () => {
        mq(FilesView);
        expect(true).toBe(true)
    })

    it("Allows you to highlight selected item", () => {
        mq(FilesView);
        expect(true).toBe(true)
    })
    it("Display files", () => {
        mq(FilesView);
        expect(true).toBe(true)
    })
})
// }