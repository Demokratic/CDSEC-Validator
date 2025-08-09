import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  Check,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import './App.css';

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const ANOMALY_TYPE_LABELS = {
  invalid_block: 'Bloc invalide',
  invalid_blockchain: 'Blockchain invalide',
  validation_error: 'Erreur de validation',
  signature_error: 'Erreur de signature',
  hash_mismatch: 'Hash incorrect',
  timestamp_error: 'Erreur de timestamp'
};

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { authenticatedFetch } = useAuth();

  const fetchAnomalies = async () => {
    try {
      const resolved = statusFilter === 'all' ? undefined : statusFilter === 'resolved';
      const params = new URLSearchParams();
      if (resolved !== undefined) params.append('resolved', resolved);
      params.append('limit', '50');

      const response = await authenticatedFetch(`/validator/anomalies?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnomalies(data.data.anomalies);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des anomalies');
    } finally {
      setLoading(false);
    }
  };

  const resolveAnomaly = async (anomalyId) => {
    setActionLoading(true);
    try {
      const response = await authenticatedFetch(`/validator/anomalies/${anomalyId}/resolve`, {
        method: 'PUT',
        body: JSON.stringify({ resolution_notes: resolutionNotes })
      });

      if (response.ok) {
        toast.success('Anomalie marquée comme résolue');
        setResolutionNotes('');
        fetchAnomalies();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Erreur lors de la résolution');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la résolution');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAnomaly = async (anomalyId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette anomalie ?')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await authenticatedFetch(`/admin/anomalies/${anomalyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Anomalie supprimée');
        fetchAnomalies();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [statusFilter]);

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesSearch = 
      anomaly.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.anomaly_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (anomaly.block_id && anomaly.block_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'all' || anomaly.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const anomaliesByType = anomalies.reduce((acc, anomaly) => {
    acc[anomaly.anomaly_type] = (acc[anomaly.anomaly_type] || 0) + 1;
    return acc;
  }, {});

  const unresolvedCount = anomalies.filter(a => !a.resolved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Anomalies</h1>
          <p className="text-muted-foreground">
            Gestion et résolution des anomalies détectées
          </p>
        </div>
        <Button onClick={fetchAnomalies} variant="outline">
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomalies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non résolues</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unresolvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{anomalies.length - unresolvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types différents</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(anomaliesByType).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Types d'anomalies */}
      {Object.keys(anomaliesByType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(anomaliesByType).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-sm">
                  {ANOMALY_TYPE_LABELS[type] || type}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par description, type ou ID de bloc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="unresolved">Non résolues</SelectItem>
                <SelectItem value="resolved">Résolues</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des anomalies */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des anomalies</CardTitle>
          <CardDescription>
            {filteredAnomalies.length} anomalie(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAnomalies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sévérité</TableHead>
                  <TableHead>Bloc ID</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnomalies.map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {ANOMALY_TYPE_LABELS[anomaly.anomaly_type] || anomaly.anomaly_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {anomaly.description}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${SEVERITY_COLORS[anomaly.severity]}`}>
                        {anomaly.severity}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {anomaly.block_id ? `${anomaly.block_id.substring(0, 8)}...` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={anomaly.resolved ? "default" : "destructive"}>
                        {anomaly.resolved ? "Résolue" : "Non résolue"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(anomaly.detected_at).toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedAnomaly(anomaly)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de l'anomalie</DialogTitle>
                              <DialogDescription>
                                {ANOMALY_TYPE_LABELS[anomaly.anomaly_type] || anomaly.anomaly_type}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedAnomaly && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Type</Label>
                                    <p className="text-sm">{ANOMALY_TYPE_LABELS[selectedAnomaly.anomaly_type] || selectedAnomaly.anomaly_type}</p>
                                  </div>
                                  <div>
                                    <Label>Sévérité</Label>
                                    <p className="text-sm">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${SEVERITY_COLORS[selectedAnomaly.severity]}`}>
                                        {selectedAnomaly.severity}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm mt-1">{selectedAnomaly.description}</p>
                                </div>

                                {selectedAnomaly.block_id && (
                                  <div>
                                    <Label>ID du bloc</Label>
                                    <p className="text-sm font-mono mt-1">{selectedAnomaly.block_id}</p>
                                  </div>
                                )}

                                <div>
                                  <Label>Détectée le</Label>
                                  <p className="text-sm mt-1">{new Date(selectedAnomaly.detected_at).toLocaleString('fr-FR')}</p>
                                </div>

                                {selectedAnomaly.data && (
                                  <div>
                                    <Label>Données supplémentaires</Label>
                                    <ScrollArea className="h-32 mt-1">
                                      <pre className="text-xs bg-muted p-2 rounded">
                                        {JSON.stringify(JSON.parse(selectedAnomaly.data), null, 2)}
                                      </pre>
                                    </ScrollArea>
                                  </div>
                                )}

                                {selectedAnomaly.resolved && (
                                  <div>
                                    <Label>Résolue le</Label>
                                    <p className="text-sm mt-1">{new Date(selectedAnomaly.resolved_at).toLocaleString('fr-FR')}</p>
                                    {selectedAnomaly.resolution_notes && (
                                      <div className="mt-2">
                                        <Label>Notes de résolution</Label>
                                        <p className="text-sm mt-1">{selectedAnomaly.resolution_notes}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!selectedAnomaly.resolved && (
                                  <div className="space-y-2">
                                    <Label htmlFor="resolution-notes">Notes de résolution (optionnel)</Label>
                                    <Textarea
                                      id="resolution-notes"
                                      value={resolutionNotes}
                                      onChange={(e) => setResolutionNotes(e.target.value)}
                                      placeholder="Décrivez comment cette anomalie a été résolue..."
                                    />
                                    <Button 
                                      onClick={() => resolveAnomaly(selectedAnomaly.id)}
                                      disabled={actionLoading}
                                      className="w-full"
                                    >
                                      {actionLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      ) : (
                                        <Check className="h-4 w-4 mr-2" />
                                      )}
                                      Marquer comme résolue
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {anomaly.resolved && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteAnomaly(anomaly.id)}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune anomalie trouvée
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

