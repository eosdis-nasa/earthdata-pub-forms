module.exports = {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    done: [],
                    undone: [],
                    newMutation: true
                };
            },
            created() {
                this.$store.subscribe(mutation => {
                    if (mutation.type !== EMPTY_STATE) {
                        this.done.push(mutation);
                    }
                    if (this.newMutation) {
                        this.undone = [];
                    }
                });
            },
            methods: {
                redo() {
                    let commit = this.undone.pop();
                    this.newMutation = false;
                    this.$store.commit(`${commit.type}`, commit.payload);
                    this.newMutation = true;
                },
                undo() {
                    this.undone.push(this.done.pop());
                    this.newMutation = false;
                    this.$store.commit(EMPTY_STATE);
                    this.done.forEach(mutation => {
                        this.$store.commit(`${mutation.type}`, mutation.payload);
                        this.done.pop();
                    });
                    this.newMutation = true;
                }
            }
        });
    },
}