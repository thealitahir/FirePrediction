/*
 @license Angular Treeview version 0.1.6
 ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
 License: MIT


 [TREE attribute]
 angular-treeview: the treeview directive
 tree-id : each tree's unique id.
 tree-model : the tree model on $scope.
 node-id : each node's id
 node-label : each node's label
 node-children: each node's children

 <div
 data-angular-treeview="true"
 data-tree-id="tree"
 data-tree-model="roleList"
 data-node-id="roleId"
 data-node-label="roleName"
 data-node-children="children" >
 </div>
 */

(function ( angular ) {
    'use strict';

    angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile','applicationService', function( $compile ,applicationService) {
        return {
            restrict: 'A',
            link: function ( scope, element, attrs ) {


                //tree id
                var treeId = attrs.treeId;
                var search = attrs.treeSearch;


                //tree model
                var treeModel = attrs.treeModel;

                //node id
                var nodeId = attrs.nodeId || 'id';

                //node label
                var nodeLabel = attrs.nodeLabel || 'name';
                //appID
                var nodeAppId   = attrs.nodeAppId || 'application_id'
                //appID
                var nodeType   = attrs.nodeType || 'type'

                //children
                var nodeChildren = attrs.nodeChildren || 'children';

                //tree template
                var template =

                    '<ul class="app-tree">' +


                    '<li ng-class="{\'application\':node.type==\'application\',\'pipelines\':node.type==\'Pipelines\',\'dashboards\':node.type==\'Dashboards\'}" data-ng-repeat="node in ' + treeModel + ' | treeFilter:search "> ' +

                    '<div class="label-row"> '+

                        '<span class="collapse-expand-node" data-ng-click="' + treeId + '.selectNodeHead(node)">'+

                            '<span ng-if="node.type==\'application\'" class="main-icon"><span class="glyphicon-custom icon-application"></span></span>'+

                            '<span ng-if="node.type==\'Pipelines\'"   class="main-icon"><span class="glyphicon-custom icon-pipeline"  ></span></span>'+

                            '<span ng-if="node.type==\'Dashboards\'"  class="main-icon"><span class="glyphicon-custom icon-custom-dashboard"></span></span>'+


                            // this line shows headings in tree
                            //'<span ng-if="node.type==\'application\' || node.type==\'Dashboards\' || node.type==\'Pipelines\'" class="app-label-dashboard" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)"><a>{{node.' + nodeLabel + '}}</a></span>' +
                            '<span ng-if="node.type==\'application\' || node.type==\'Dashboards\'" class="app-label-dashboard" data-ng-class="node.selected" title="{{node.' + nodeLabel + '}}">{{node.' + nodeLabel + '}}</span>' +

                            '<span  ng-if="node.type==\'Pipelines\'"  class="app-label-dashboard" data-ng-class="node.selected" title="{{node.' + nodeLabel + '}}"  >{{node.' + nodeLabel + '}}</span>' +



                            //'<div ng-if="node.type==\'application\'" ng-init="node.collapsed=true"></div>'+
                            '<span ng-if="node.type==\'application\'" ng-init="node.collapsed=true"></span>'+


                            '<span ng-if="node.type==\'Pipelines\' || node.type==\'Dashboards\'">'+
                                //shows contract expand icons
                                '<i class="collapsed glyphicons glyphicons-chevron-down" data-ng-show="node.' + nodeChildren + '.length && node.collapsed"></i>' +
                                '<i class="expanded glyphicons glyphicons-chevron-up" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed"></i>' +
                                '<i class="collapsed glyphicons glyphicons-chevron-down" data-ng-show="node.' + nodeChildren + '.length==0 && node.collapsed"></i>' +
                                '<i class="collapsed glyphicons glyphicons-chevron-down" data-ng-show="node.' + nodeChildren + 'node.collapsed"></i>' +
                                '<i class="expanded glyphicons glyphicons-chevron-up" data-ng-show="node.' + nodeChildren + '.length==0 && !node.collapsed"></i>' +
                            '</span>'+


                            /*'<i class="collapsed halflings halflings-triangle-right" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="expanded halflings halflings-triangle-bottom " data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="collapsed halflings halflings-triangle-right" data-ng-show="node.' + nodeChildren + '.length==0 && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="collapsed halflings halflings-triangle-right" data-ng-show="node.' + nodeChildren + 'node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="expanded halflings halflings-triangle-bottom " data-ng-show="node.' + nodeChildren + '.length==0 && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +*/


                        '</span>'+


                        '<span class="action-icons-node">'+

                            //line below deals with application edit and delete
                            '<span ng-if="node.type==\'application\'" class="action-icon" ng-click="node.show=\'true\'">' +
                                '<span class="glyphicon-custom icon-custom-edit" ng-click="edit(node)"></span>' +
                            '</span>'+
                            '<span ng-if="(node.type==\'application\')" class="action-icon" ng-click="remove(node)">' +
                                '<span class="glyphicon-custom icon-custom-close"></span>' +
                            '</span>'+

                        '</span>'+

                        '<span ng-repeat="permissionName in permissions ">'+

                            //pipelines in tree
                            '<span ng-if="permissionName.name==\'Pipelines\' && permissionName.permissions.indexOf(\'view\')>-1">'+
                                '<span ng-if="node.type==\'Pipeline\'" class="stage-label-tree label-pipeline" data-ng-class="node.selected " data-ng-click="' + treeId + '.selectNodeLabel(node)">' +
                                    //'<span style="font-size: 12px;" class="last-node-icon glyphicons glyphicons-chevron-right" ng-click="sharePipelineAndApplication(node)"></span>' +
                                    '<span ng-click="openPipeline(node.application_id,node.id)">' +
                                        '<span class="last-node-icon glyphicons glyphicons-chevron-right"></span>' +
                                        //'<span ng-if="permissionName.permissions.indexOf(\'read\')>-1 || permissionName.permissions.indexOf(\'edit\')>-1 || permissionName.permissions.indexOf(\'write\')>-1" ng-click="openPipeline(node.application_id,node.id)" title="{{node.' + nodeLabel + '}}">{{node.' + nodeLabel + '}}</span>' +
                                        '<span ng-if="permissionName.permissions.indexOf(\'view\')>-1  || permissionName.permissions.indexOf(\'create\')>-1" title="{{node.' + nodeLabel + '}}">{{node.' + nodeLabel + '}}</span>' +
                                    '</span>' +
                                '</span>' +

                                '<span class="action-icons-node">'+
                                    '<span ng-if="(node.type==\'Pipeline\')">' +

                                        '<span class="action-icons-node">'+
                                            '<span ng-click="sharePipelineAndApplication(node)" class="action-icon">' +
                                                '<span ng-if="permissionName.permissions.indexOf(\'share\')>-1" class="glyphicon-custom icon-custom-share"></span>' +
                                            '</span>' +
                                            '<span ng-click="remove(node)" class="action-icon">' +
                                                '<span ng-if="permissionName.permissions.indexOf(\'delete\')>-1" class="glyphicon-custom icon-custom-close"></span>' +
                                            '</span>' +
                                        '</span>'+

                                    '</span>'+

                                    '<span ng-if="node.name==\'Processes\' && node.type==\'Pipelines\'" ng-init="node.collapsed=true" class="action-icon" ng-click="newSubItem(node,$index)">' +
                                        '<span ng-if="permissionName.permissions.indexOf(\'create\')>-1" class="glyphicon-custom icon-custom-plus"></span>' +
                                    '</span>'+
                                '</span>'+

                            '</span>'+

                            //dashboard in tree
                            '<span ng-if="permissionName.name==\'Dashboards\' && permissionName.permissions.indexOf(\'view\')>-1">'+
                                '<span ng-if="node.type==\'Dashboard\'" class="stage-label-tree label-pipeline" data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">' +

                                '<span ng-click="openDashboard(node.application_id,node.id)">'+
                                    '<span class="last-node-icon glyphicons glyphicons-chevron-right"></span>' +
                                        //'<span ng-if="permissionName.permissions.indexOf(\'read\')>-1 || permissionName.permissions.indexOf(\'edit\')>-1 || permissionName.permissions.indexOf(\'write\')>-1 " ng-click="openDashboard(node.application_id,node.id)" title="{{node.' + nodeLabel + '}}">{{node.' + nodeLabel + '}}</span>' +
                                        '<span ng-if="permissionName.permissions.indexOf(\'view\')>-1 || permissionName.permissions.indexOf(\'create\')>-1 " title="{{node.' + nodeLabel + '}}">{{node.' + nodeLabel + '}}</span>' +
                                    '</span>' +
                                '</span>' +

                                /*'<span class="action-icons-node">'+
                                     '<span ng-if="(node.type==\'Dashboard\')"  class="action-icon"  ng-click="remove(node)">' +
                                        '<span ng-if="permissionName.permissions.indexOf(\'delete\')>-1" class="glyphicon-custom icon-custom-close"></span>' +
                                     '</span>'+
                                     '<span ng-if="node.name==\'Developers Interface\' && node.type==\'Dashboards\'" ng-init="node.collapsed=true" class="action-icon" ng-click="newSubItem(node,$index)">' +
                                        '<span ng-if="permissionName.permissions.indexOf(\'write\')>-1" class="glyphicon-custom icon-custom-plus"></span>' +
                                     '</span>'+
                                 '</span>'+*/

                                '<span class="action-icons-node">'+
                                    '<span ng-if="(node.type==\'Dashboard\')">' +

                                        '<span class="action-icons-node">'+
                                            '<span ng-click="sharePipelineAndApplication(node)" class="action-icon">' +
                                                '<span ng-if="permissionName.permissions.indexOf(\'share\')>-1" class="glyphicon-custom icon-custom-share"></span>' +
                                            '</span>' +
                                            '<span ng-click="remove(node)" class="action-icon">' +
                                                '<span ng-if="permissionName.permissions.indexOf(\'delete\')>-1" class="glyphicon-custom icon-custom-close"></span>' +
                                            '</span>' +
                                        '</span>'+

                                    '</span>'+

                                    '<span ng-if="node.name==\'Developers Interface\' && node.type==\'Dashboards\'" ng-init="node.collapsed=true" class="action-icon" ng-click="newSubItem(node,$index)">' +
                                        '<span ng-if="permissionName.permissions.indexOf(\'create\')>-1" class="glyphicon-custom icon-custom-plus"></span>' +
                                    '</span>'+
                                '</span>'+

                            '</span>'+

                        '</span>'+

                    '</div>'+

                    '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-name=' + nodeLabel + ' data-node-children=' + nodeChildren + ' data-node-application_id=' + nodeAppId +  ' data-node-type=' + nodeType + '></div>' +
                    '</li>' +
                    '</ul>';


                //check tree id, tree model
                if( treeId && treeModel ) {

                    //root nodeeditValue
                    if( attrs.angularTreeview ) {

                        //create tree object if not exists
                        scope[treeId] = scope[treeId] || {};

                        //if node head clicks,
                        scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

                            //Collapse or Expand000

                            selectedNode.collapsed = !selectedNode.collapsed;


                        };
                        //if node label clicks,
                        scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

                            //remove highlight from previous node
                            applicationService.app_id= selectedNode.id;
                            if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
                                scope[treeId].currentNode.selected = undefined;
                            }

                            //set highlight to selected node

                            console.log(search);

                            selectedNode.selected = 'selected';

                            //set currentNode
                            scope[treeId].currentNode = selectedNode;
                        };
                    }

                    //Rendering template.
                    element.html('').append( $compile( template )( scope ) );
                }
            }
        };
    }]);
})( angular );
