import { describe, expect, it } from "vitest";
import mq from "mithril-query";
import { Path } from "../src/view/home/Path";
describe("home path component", () => {
    describe("Show each element of a path", () => {
        it("That doesn't start with /", () => {
            const pathElement = ["my", "awesome", "road"];
            const out = mq(Path, {
                path: pathElement.join("/"),
            });
            for (const element of pathElement) {
                expect(out.contains(element))
            }
            // out.log(".path")
            expect(out.find("svg").length).toBe(3);
        })
        it("That start with /", () => {
            const pathElement = ["", "my", "awesome", "road"];
            const out = mq(Path, {
                path: pathElement.join("/"),
            });
            for (const element of pathElement) {
                expect(out.contains(element))
            }
            // out.log(".path")
            expect(out.find("svg").length).toBe(3);

        })
        it("That doesn't end with /", () => {
            const pathElement = ["my", "awesome", "road", ""];
            const out = mq(Path, {
                path: pathElement.join("/"),
            });
            for (const element of pathElement) {
                expect(out.contains(element))
            }
            // out.log(".path")
            expect(out.find("svg").length).toBe(3);
        })
    });
    it("Allow to go to any element of the path", () => {
        const pathElement = ["my", "awesome", "road", ""];
        for (let i = 0; i < pathElement.length; i++) {
            let path = "";
            const out = mq(Path, {
                path: pathElement.join("/"),
                updatePath(value) {
                    path = value;
                }
            });
            const item = out.find(".path-item")[i];
            if (item !== undefined) {
                item.click();
                for (let j = 0; j < item.length; j++) {
                    let expectedPath = ""
                    for (let k = 0; k < j; k++) {
                        expectedPath += pathElement[k] + "/"
                    }
                    expect(path).toBe(expectedPath)

                }
            }
        }
    })
});