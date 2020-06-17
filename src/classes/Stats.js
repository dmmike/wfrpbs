import Roller from "@/classes/Roller";

export default class Stats {
    constructor(
        m = 4,
        ws = 30,
        bs = 30,
        s = 30,
        t = 30,
        i = 30,
        agi = 30,
        dex = 30,
        int = 30,
        wp = 30,
        fel = 30,
        fate = 0,
        fortune = 0,
        resilience = 0,
        resolve = 0,
        size = 3
    ) {
        this.m = m;

        class Stat {
            constructor(value) {
                this.value = value;
            }

            get b() {
                if (typeof this.value === 'string') {
                    return 0;
                }
                else {
                    return Math.floor(this.value / 10);
                }
            }

            simpleTest(modifier = 0) {
                return Roller.simpleTest(this.value + modifier);
            }

            dramaticTest(modifier = 0) {
                return Roller.dramaticTest(this.value + modifier);
            }
        }

        this.ws = new Stat(ws);
        this.bs = new Stat(bs);
        this.s = new Stat(s);
        this.t = new Stat(t);
        this.i = new Stat(i);
        this.agi = new Stat(agi);
        this.dex = new Stat(dex);
        this.int = new Stat(int);
        this.wp = new Stat(wp);
        this.fel = new Stat(fel);

        this.size = size;

        this.fate = fate;
        this.maxFortune = fortune ? fortune : fate;
        this.currentFortune = this.maxFortune;

        this.resilience = resilience;
        this.maxResolve = resolve ? resolve : resilience;
        this.currentResolve = this.maxResolve;
    }

    static revive(data) {
        return new Stats(
            data.m.value,
            data.ws.value,
            data.bs.value,
            data.s.value,
            data.t.value,
            data.i.value,
            data.agi.value,
            data.dex.value,
            data.int.value,
            data.wp.value,
            data.fel.value,
            data.fate,
            data.maxFortune,
            data.resilience,
            data.maxResolve,
            data.size
        )
    }
}