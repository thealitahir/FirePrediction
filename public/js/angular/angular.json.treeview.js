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

	angular.module( 'jsonTreeView', [] ).directive( 'jsonTreeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {
				//tree id

				//console.log(attrs)
				var treeId = attrs.jsonTreeId;

				//tree model
				var treeModel = attrs.jsonTreeModel;

				//node id
				var nodeId = attrs.jsonNodeId || 'id';

				//node label
				var nodeLabel = attrs.jsonNodeLabel || 'label';

				//node type
				var nodeType = attrs.jsonNodeType || 'type';

				//node checked
				var nodeChecked = attrs.jsonNodeChecked || 'type';

				//node checked
				var nodePath = attrs.jsonNodePath || 'path';

				//children
				var nodeChildren = attrs.jsonNodeChildren || 'children';

				//tree template
				var template =
					'<ul>' +
					'<li data-ng-repeat="node in ' + treeModel + '">' +
					'<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
					'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
					'<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
					'<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">' +
					'<input type="checkbox" ng-model="node.checked" ng-true-value=true ng-false-value=false ng-click="getSelectedNode(node)">'+
					'{{node.' + nodeLabel + '}}</span>' +
					'<div data-ng-hide="node.collapsed" data-json-tree-id="' + treeId + '" data-json-tree-model="node.' + nodeChildren + '" data-json-node-id=' + nodeId + ' data-json-node-label=' + nodeLabel + ' data-json-node-children=' + nodeChildren + '></div>' +
					'</li>' +
					'</ul>';


				//check tree id, tree model
				if( treeId && treeModel ) {

					//root node
					if( attrs.angularJsonTreeview ) {

						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

								//Collapse or Expand
								selectedNode.collapsed = !selectedNode.collapsed;
							};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

								//remove highlight from previous node
								if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
									scope[treeId].currentNode.selected = undefined;
								}

								//set highlight to selected node
								selectedNode.selected = 'selected';

								//set currentNode
								scope[treeId].currentNode = selectedNode;

								//console.log(selectedNode);
							};
					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		};
	}]);
})( angular );
