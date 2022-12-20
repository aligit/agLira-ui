import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenSjon from '../assets/GroupTenToken.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  provider: ethers.providers.Provider;
  wallet: ethers.Wallet | undefined;
  tokenAddress: string | undefined;
  tokenContract: ethers.Contract | undefined;
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider("goerli");
  }

  createWallet() {
    this.http.get<any>("http://localhost:3001/token-address").subscribe((ans) => {
      this.tokenAddress = ans.result;
      if (this.tokenAddress) {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        this.tokenContract = new ethers.Contract(this.tokenAddress, tokenSjon.abi, this.wallet);
        this.updateInfo(this.wallet, this.tokenContract);
      }
    });
  }

  private updateInfo(wallet: ethers.Wallet, contract: ethers.Contract) {
    wallet.getBalance().then((balanceBN: ethers.BigNumberish) => {
      this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
    });
    // this.tokenContract.balanceOf() doesn't work so pick it up in the following way
    contract["balanceOf"](wallet.address).then((balanceBN: ethers.BigNumberish) => {
      this.tokenBalance = parseFloat(ethers.utils.formatEther(balanceBN));
    });
    contract["getVotes"](wallet.address).then((voteBN: ethers.BigNumberish) => {
      this.votePower = parseFloat(ethers.utils.formatEther(voteBN));
    });
  }

  claimTokens() {
    // console.log(`from claimTokens function`)
    this.http
      .post<any>("http://localhost:3001/claim-tokens",
        {
          address: this.wallet?.address,
        })
      .subscribe((a) => {
        const txHash = a.result;
        this.provider.getTransaction(txHash).then((tx) => {
          //TODO: (optional) display
          // Reload info by calling the
          // })
        })
      });
  }

  connectBallot(address: string) {
    // this.getBallotInfo();
  }
}
