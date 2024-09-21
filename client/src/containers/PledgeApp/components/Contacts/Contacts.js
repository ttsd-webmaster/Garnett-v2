// @flow

import "./Contacts.css";
import filters from "./data.js";
import API from "api/API";
import {
  isMobile,
  androidBackOpen,
  androidBackClose,
  iosFullscreenDialogOpen,
  iosFullscreenDialogClose,
  setRefresh,
} from "helpers/functions.js";
import { LoadingComponent } from "helpers/loaders.js";
import { Filter, FilterHeader, UserRow } from "components";
import { LoadableContactsDialog } from "./components/Dialogs";
import type { FilterType, FilterName } from "./data.js";
import type { User } from "api/models";

import React, { Fragment, PureComponent, type Node } from "react";
import { List } from "material-ui/List";
import Subheader from "material-ui/Subheader";

const FILTER_OPTIONS = [
  "Active",
  "Alumni",
  "Class",
  "Major",
  "Year",
  // "First Name",
  // "Last Name",
  "Personality Type",
];

type State = {
  brothers: ?Array<User>,
  filteredBrothers: ?Array<User>,
  selectedBrother: ?User,
  searchedName: string,
  filterKey: FilterType,
  filterName: FilterName,
  filterSubgroups: ?Array<string>,
  reverse: boolean,
  open: boolean,
  openPopover: boolean,
  anchorEl: ?HTMLElement,
};

export class Contacts extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const brothers = JSON.parse(localStorage.getItem("brothers"));
    const filterKey = localStorage.getItem("contactsFilterKey") || "active";
    const filterName = localStorage.getItem("contactsFilterName") || "Active";
    const filterSubgroups =
      JSON.parse(localStorage.getItem("contactsFilterSubgroups")) ||
      filters.active;
    this.state = {
      brothers,
      filteredBrothers: brothers,
      selectedBrother: null,
      searchedName: "",
      filterKey,
      filterName,
      filterSubgroups,
      reverse: false,
      open: false,
      openPopover: false,
      anchorEl: null,
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      setRefresh(null);

      API.getBrothers().then((res) => {
        const brothers = res.data;
        localStorage.setItem("brothers", JSON.stringify(res.data));
        this.setState({ brothers, filteredBrothers: brothers });
      });
    }
  }

  get body(): Node {
    const { filteredBrothers, filterSubgroups } = this.state;
    const groups = [];
    let index = 0;

    if (!filteredBrothers) {
      return null;
    }

    filterSubgroups.forEach((subgroup) => {
      const includesBrother = filteredBrothers.some((brother) =>
        this.checkCondition(brother, subgroup)
      );

      if (!includesBrother) {
        return null;
      }

      const group = (
        <Fragment key={index}>
          {this.header(subgroup, index++)}
          <List className="garnett-list">
            {filteredBrothers.map(
              (brother, i) =>
                this.checkCondition(brother, subgroup) && (
                  <UserRow
                    key={i}
                    user={brother}
                    handleOpen={() => this.handleOpen(brother)}
                  />
                )
            )}
          </List>
        </Fragment>
      );

      groups.push(group);
    });
    return groups;
  }

  get modalTitle(): string {
    switch (this.state.filterKey) {
      case "active":
        return "Active";
      case "alumni":
        return "Alumni";
      default:
        return "Brother";
    }
  }

  header = (subgroup: string, index: number): Node => {
    if (index === 0) {
      return (
        <FilterHeader
          className="garnett-subheader"
          title={subgroup}
          openPopover={this.openPopover}
          isReversed={this.state.reverse}
          reverse={this.reverse}
        />
      );
    }
    return <Subheader className="garnett-subheader">{subgroup}</Subheader>;
  };

  checkCondition(brother: User, subgroup: string): boolean {
    if (!brother) {
      return false;
    }

    switch (this.state.filterKey) {
      case "active":
        return brother.status !== "alumni" && brother.class === subgroup;
      case "alumni":
        return brother.status === "alumni" && brother.class === subgroup;
      case "firstName":
        return (
          brother.firstName &&
          brother.firstName.toLowerCase().startsWith(subgroup.toLowerCase())
        );
      case "lastName":
        return (
          brother.lastName &&
          brother.lastName.toLowerCase().startsWith(subgroup.toLowerCase())
        );
      default:
        return brother[this.state.filterKey] === subgroup;
    }
  }

  setSearchedName = (event: SyntheticEvent<>) => {
    const searchedName = event.target.value;
    const { brothers } = this.state;
    let result = [];

    if (!brothers) {
      return;
    }

    if (searchedName === "") {
      result = brothers;
    } else {
      brothers.forEach((user) => {
        const userName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (userName.startsWith(searchedName.trim().toLowerCase())) {
          result.push(user);
        }
      });
    }

    this.setState({ filteredBrothers: result, searchedName });
  };

  clearInput = () => {
    this.setState({ filteredBrothers: this.state.brothers, searchedName: "" });
  };

  handleOpen = (selectedBrother: User) => {
    iosFullscreenDialogOpen();
    androidBackOpen(this.handleClose);
    this.setState({ selectedBrother, open: true });
  };

  handleClose = () => {
    androidBackClose();
    this.setState({ open: false }, () => {
      iosFullscreenDialogClose();
    });
  };

  openPopover = (event: SyntheticEvent<>) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      openPopover: true,
      anchorEl: event.currentTarget,
    });
  };

  closePopover = () => this.setState({ openPopover: false });

  setFilter = (filterName: FilterName) => {
    let filterKey = filterName.replace(/ /g, "");
    // Convert first letter of filter to be lower cased
    filterKey = filterKey[0].toLowerCase() + filterKey.substr(1);
    let group = filterKey;

    switch (filterName) {
      case "Alumni":
        group = "class";
        break;
      case "First Name":
        filterKey = "firstName";
        group = "firstName"; // Correctly set the group for first name filtering
        break;
      case "Last Name":
        filterKey = "lastName";
        group = "lastName"; // Correctly set the group for last name filtering
        break;
      case "Personality Type":
        filterKey = "mbti";
        group = "mbti";
        break;
      default:
    }

    const filterSubgroups = filters[group];

    localStorage.setItem("contactsFilterKey", filterKey);
    localStorage.setItem("contactsFilterName", filterName);
    localStorage.setItem(
      "contactsFilterSubgroups",
      JSON.stringify(filterSubgroups)
    );

    this.setState({
      filterKey,
      filterName,
      filterSubgroups,
      openPopover: false,
      reverse: false,
    });
  };

  reverse = () => {
    const { filterSubgroups, reverse } = this.state;
    this.setState({
      filterSubgroups: filterSubgroups.reverse(),
      reverse: !reverse,
    });
  };

  render() {
    const {
      brothers,
      selectedBrother,
      searchedName,
      filterName,
      open,
      openPopover,
      anchorEl,
    } = this.state;

    if (!brothers) {
      return <LoadingComponent />;
    }

    return (
      <div id="contacts-container" className="content animate-in">
        <div id="search-input-container">
          <input
            id="search-brothers-input"
            type="text"
            placeholder="Name"
            autoComplete="off"
            value={searchedName}
            onChange={this.setSearchedName}
          />
          <span
            id="clear-input"
            className={`${(!isMobile() || !searchedName) && "hidden"}`}
            onClick={this.clearInput}
          >
            &times;
          </span>
        </div>

        <Filter
          open={openPopover}
          anchorEl={anchorEl}
          filters={FILTER_OPTIONS}
          filterName={filterName}
          closePopover={this.closePopover}
          setFilter={this.setFilter}
        />

        {this.body}

        {selectedBrother && (
          <LoadableContactsDialog
            open={open}
            active={selectedBrother}
            title={this.modalTitle}
            handleClose={this.handleClose}
          />
        )}
      </div>
    );
  }
}
