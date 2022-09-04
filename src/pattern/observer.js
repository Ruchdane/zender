export const subject = {
    observer: [],
    notify() {
        this.observer.forEach(element => {
            element[element.method]()
        });
    }
}
export const observer = {
    method: "",
}