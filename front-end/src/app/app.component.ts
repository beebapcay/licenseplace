import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRouteConstant } from './common/app-route.constant';
import { AppSrcAssetsConstant } from './common/app-src-assets.constant';
import { SubscriptionAwareAbstractComponent } from './components/subscription-aware.abstract.component';
import { AccountModel } from './models/account.model';

import { NotSupportedErrorModel } from './models/error.model';
import { AccountService } from './services/account.service';
import { BreadcrumbService } from './services/breadcrumb.service';
import { LicenseplaceService } from './services/licenseplace.service';
import { ProviderService } from './services/provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent
  extends SubscriptionAwareAbstractComponent
  implements OnInit {
  readonly NotSupportedErrorModel = NotSupportedErrorModel;
  readonly AppSrcAssetsConstant = AppSrcAssetsConstant;

  account: AccountModel;

  constructor(
    public titleService: Title,
    public router: Router,
    public route: ActivatedRoute,
    public breadcrumbService: BreadcrumbService,
    public providerService: ProviderService,
    public licenseplaceService: LicenseplaceService,
    public accountService: AccountService
  ) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle(AppRouteConstant.TAB_TITLE);

    // TODO: delay here because i dont find any solution when start app blinks
    setTimeout(async () => {
      await this.providerService.connect();
      await this.accountService.getAccountInformation();
      await this.licenseplaceService.loadLicenseplace();
    }, 1500);


    this.registerSubscription(
      this.accountService.account.subscribe(account => {
        this.account = account;
      })
    );
  }
}
