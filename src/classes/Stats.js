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

        this.fate = fate;
        this.maxFortune = fortune ? fortune : fate;
        this.currentFortune = this.maxFortune;

        this.resilience = resilience;
        this.maxResolve = resolve ? resolve : resilience;
        this.currentResolve = this.maxResolve;
    }

    static revive(data) {
        return new Stats(
            Number.parseInt(data.m),
            Number.parseInt(data.ws.value),
            Number.parseInt(data.bs.value),
            Number.parseInt(data.s.value),
            Number.parseInt(data.t.value),
            Number.parseInt(data.i.value),
            Number.parseInt(data.agi.value),
            Number.parseInt(data.dex.value),
            Number.parseInt(data.int.value),
            Number.parseInt(data.wp.value),
            Number.parseInt(data.fel.value),
            Number.parseInt(data.fate),
            Number.parseInt(data.maxFortune),
            Number.parseInt(data.resilience),
            Number.parseInt(data.maxResolve)
        )
    }
}