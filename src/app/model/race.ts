import { Car } from "./car";
import { CarInfo } from "./car-info";
import { CarSetup } from "./carSetup";
import { Parcour } from "./parcour";
import { ParcourInfo } from "./parcour-info";
import { Team } from "./teams";

export enum Weather {
    SUN, CLOUDY, CLOUDS, RAIN_LITTLE, RAIN
}

export class Race {

    parcour: ParcourInfo = new Parcour();
    weather = Weather.CLOUDS;

    private readonly _cars: Car[] = [
        new Car(new CarSetup(Team.YELLOW)),
        new Car(new CarSetup(Team.RED)),
        new Car(new CarSetup(Team.GREEN)),
        new Car(new CarSetup(Team.BLUE)),
        new Car(new CarSetup(Team.VIOLET)),
        new Car(new CarSetup(Team.BLACK)),
    ];

    get cars(): CarInfo[] {
        return this._cars.filter(c => !c.isFinished);
    }

    setCarStartPosition(team: Team, position: number) {
        this._cars[team].position = this.parcour.getStartPosition(position);
        this._cars[team].stop();
        this._cars[team].isFinished = false;
    }

    start() {
        this.setCarStartPosition(Team.YELLOW, 1);
        this.setCarStartPosition(Team.RED, 2);
        this.setCarStartPosition(Team.GREEN, 3);
        this.setCarStartPosition(Team.BLUE, 4);
        this.setCarStartPosition(Team.VIOLET, 5);
        this.setCarStartPosition(Team.BLACK, 6);
    }

    stop() {
        this._cars.forEach(car => {
            car.stop();
            car.isFinished = true;
        });
    }
}