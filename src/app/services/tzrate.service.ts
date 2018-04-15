import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { WalletService } from './wallet.service';
import 'rxjs/add/operator/map';

@Injectable()
export class TzrateService {

    private apiUrl = 'https://api.coinmarketcap.com/v1/ticker/tezos/'; // returns a json object, key: price_usd

    constructor(private http: HttpClient,
        private walletService: WalletService) {
    }

    getTzrate() {
        console.log('updating xtz price');
        this.http.get(this.apiUrl).subscribe(
            data => {
                this.walletService.wallet.XTZrate = data[0]['price_usd'];
                this.updateFiatBalances();
            },
            err => console.log('Failed to get xtz price from CMC: ' + JSON.stringify(err))
        );
    }
    updateFiatBalances() {
        let tot = 0;
        for (let i = 0; i < this.walletService.wallet.accounts.length; i++) {
            this.walletService.wallet.accounts[i].balance.balanceFiat =
            Number(this.walletService.wallet.accounts[i].balance.balanceXTZ / 1000000 * this.walletService.wallet.XTZrate);
            tot += this.walletService.wallet.accounts[i].balance.balanceFiat;
        }
        this.walletService.wallet.balance.balanceFiat = Number(tot);
        this.walletService.storeWallet();
    }
}
