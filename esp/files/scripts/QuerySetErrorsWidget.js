/*##############################################################################
#    HPCC SYSTEMS software Copyright (C) 2012 HPCC Systems.
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
############################################################################## */
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",

    "dgrid/OnDemandGrid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/selector",
    "dgrid/extensions/ColumnResizer",
    "dgrid/extensions/DijitRegistry",

    "hpcc/GridDetailsWidget",
    "hpcc/WsWorkunits",
    "hpcc/ESPUtil"
], function (declare, arrayUtil, lang, on,
                OnDemandGrid, Keyboard, Selection, selector, ColumnResizer, DijitRegistry,
                GridDetailsWidget, WsWorkunits, ESPUtil) {
    return declare("QuerySetErrorsWidget", [GridDetailsWidget], {

        gridTitle: "Errors",
        idProperty: "Name",

        queryId: null,
        querySet: null,

        init: function (params) {
            if (this.inherited(arguments))
                return;
        
            this.refreshGrid();
            //disabled buttons for now since we cannot open an error atm 
            
        },

        createGrid: function (domID) {
            var context = this;
            var retVal = new declare([OnDemandGrid, Keyboard, Selection, ColumnResizer, DijitRegistry, ESPUtil.GridHelper])({
                allowSelectAll: true,
                deselectOnRefresh: false,
                store: this.store,
                columns: {
                    col1: selector({ width: 27, selectorType: 'checkbox' }),
                    Cluster: { label: "Cluster", width: 108, sortable: false },
                    Errors: { label: "Error", width: 108, sortable: false },
                    State: { label: "State", width: 108, sortable: false },

                }
            }, domID);

            on(document, "." + this.id + "WuidClick:click", function (evt) {
                if (context._onRowDblClick) {
                    var row = retVal.row(evt).data;
                    context._onRowDblClick(row);
                }
            });
            return retVal;
        },

        refreshGrid: function (args) {
            var errors = [];
            if (lang.exists("params.Query.Clusters.ClusterQueryState", this)) {
                var context = this;
                arrayUtil.forEach(this.params.Query.Clusters.ClusterQueryState, function (item, idx) {
                    var error = {
                        Cluster: item.Cluster,
                        Errors: item.Error,
                        State: item.State
                    }
                    errors.push(error);
                });
            }
            this.store.setData(errors);
            this.grid.refresh();
        }
    });
});
